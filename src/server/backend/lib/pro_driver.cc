#include <chrono>
#include <thread>
#include <vector>
#include <ios>
#include <sstream>
#include <algorithm>
#include <iostream>
#include <cstring>
#include <cstdlib>

#include "pro_driver.h"

#if SET_PORT_ASSIGNMENT_LABEL == 0
  //#error PRO MK2 LABELS NOT DEFINED
#endif

/* Function : FTDI_ClosePort
 * Author    : ENTTEC
 * Purpose  : Closes the Open DMX USB PRO Device Handle
 * Parameters: none
 **/
void EnttecPro::FTDI_ClosePort()
{
    if (_device_handle != NULL)
        FT_Close(_device_handle);
}

/* Function : FTDI_ListDevices
 * Author    : ENTTEC
 * Purpose  : Returns the no. of PRO's conneced to the PC
 * Parameters: none
 **/
int EnttecPro::FTDI_ListDevices()
{
    FT_STATUS ftStatus;
    DWORD numDevs=0;
    ftStatus = FT_ListDevices((PVOID)&numDevs,NULL,FT_LIST_NUMBER_ONLY);
    if(ftStatus == FT_OK)
        return numDevs;
    return NO_RESPONSE;
}

void EnttecPro::FTDI_Reload()
{
    WORD wVID = 0x0403;
    WORD wPID = 0x6001;
    FT_STATUS ftStatus;

    std::cout << "Reloading devices for use with drivers" << std::endl;
    ftStatus = FT_Reload(wVID,wPID);
    // Must wait a while for devices to be re-enumerated
    std::this_thread::sleep_for(std::chrono::milliseconds(3500));
    if(ftStatus != FT_OK)
    {
        std::cout << "Reloading Driver FAILED" << std::endl;
    }
    else
        std::cout << "Reloading Driver D2XX PASSED" << std::endl;
}

/* Function : FTDI_SendData
 * Author    : ENTTEC
 * Purpose  : Send Data (DMX or other packets) to the PRO
 * Parameters: Label, Pointer to Data Structure, Length of Data
 **/
int EnttecPro::FTDI_SendData(int label, unsigned char *data, unsigned int length)
{
    unsigned char end_code = DMX_END_CODE;
    FT_STATUS res = 0;
    DWORD bytes_to_write = length;
    DWORD bytes_written = 0;
    HANDLE event = NULL;

    // Form Packet Header
    unsigned char header[DMX_HEADER_LENGTH];
    header[0] = DMX_START_CODE;
    header[1] = label;
    header[2] = length & OFFSET;
    header[3] = length >> BYTE_LENGTH;
    // Write The Header
    res = FT_Write(    _device_handle,(unsigned char *)header,DMX_HEADER_LENGTH,&bytes_written);
    if (bytes_written != DMX_HEADER_LENGTH) return  NO_RESPONSE;
    // Write The Data
    res = FT_Write(    _device_handle,(unsigned char *)data,length,&bytes_written);
    if (bytes_written != length) return  NO_RESPONSE;
    // Write End Code
    res = FT_Write(    _device_handle,(unsigned char *)&end_code,ONE_BYTE,&bytes_written);
    if (bytes_written != ONE_BYTE) return  NO_RESPONSE;
    if (res == FT_OK)
        return TRUE;
    else
        return FALSE;
}

/* Function : FTDI_ReceiveData
 * Author    : ENTTEC
 * Purpose  : Receive Data (DMX or other packets) from the PRO
 * Parameters: Label, Pointer to Data Structure, Length of Data
 **/
int EnttecPro::FTDI_ReceiveData(int label, unsigned char *data, unsigned int expected_length)
{

    FT_STATUS res = 0;
    DWORD length = 0;
    DWORD bytes_to_read = 1;
    DWORD bytes_read =0;
    unsigned char byte = 0;
    HANDLE event = NULL;
    char buffer[600];
    // Check for Start Code and matching Label
    while (byte != label)
    {
        while (byte != DMX_START_CODE)
        {
            res = FT_Read(_device_handle,(unsigned char *)&byte,ONE_BYTE,&bytes_read);
            if(bytes_read== NO_RESPONSE) return  NO_RESPONSE;
        }
        res = FT_Read(_device_handle,(unsigned char *)&byte,ONE_BYTE,&bytes_read);
        if (bytes_read== NO_RESPONSE) return  NO_RESPONSE;
    }
    // Read the rest of the Header Byte by Byte -- Get Length
    res = FT_Read(_device_handle,(unsigned char *)&byte,ONE_BYTE,&bytes_read);
    if (bytes_read== NO_RESPONSE) return  NO_RESPONSE;
    length = byte;
    res = FT_Read(_device_handle,(unsigned char *)&byte,ONE_BYTE,&bytes_read);
    if (res != FT_OK) return  NO_RESPONSE;
    length += ((uint32_t)byte)<<BYTE_LENGTH;
    // Check Length is not greater than allowed
    if (length > 600)
    {
        std::cerr << "Error: recieved length exceeds limit !" << std::endl;
        return  NO_RESPONSE;
    }
    // Read the actual Response Data
    res = FT_Read(_device_handle,buffer,length,&bytes_read);
    if(bytes_read != length) return  NO_RESPONSE;
    // Check The End Code
    res = FT_Read(_device_handle,(unsigned char *)&byte,ONE_BYTE,&bytes_read);
    if(bytes_read== NO_RESPONSE) return  NO_RESPONSE;
    if (byte != DMX_END_CODE) return  NO_RESPONSE;
    // Copy The Data read to the buffer passed
    memcpy(data,buffer,expected_length);
    return TRUE;
}

/* Function : FTDI_PurgeBuffer
 * Author    : ENTTEC
 * Purpose  : Clears the buffer used internally by the PRO
 * Parameters: none
 **/
void EnttecPro::FTDI_PurgeBuffer()
{
    FT_Purge (_device_handle,FT_PURGE_TX);
    FT_Purge (_device_handle,FT_PURGE_RX);
}


/* Function : FTDI_OpenDevice
 * Author    : ENTTEC
 * Purpose  : Opens the PRO; Tests various parameters; outputs info
 * Parameters: device num (returned by the List Device fuc), Fw Version MSB, Fw Version LSB
 **/
uint16_t EnttecPro::FTDI_OpenDevice(int device_num)
{
    int ReadTimeout = 120;
    int WriteTimeout = 100;
    int VersionMSB =0;
    int VersionLSB =0;
    uint8_t temp[4];
    long version;
    uint8_t major_ver,minor_ver,build_ver;
    int recvd =0;
    unsigned char byte = 0;
    int size = 0;
    int res = 0;
    int tries =0;
    uint8_t latencyTimer;
    FT_STATUS ftStatus;
    int BreakTime;
    int MABTime;

    // Try at least 3 times
    do  {
        std::cout << "------ D2XX ------- Opening [Device " << device_num << "] ------ Try " << tries << std::endl;
        ftStatus = FT_Open(device_num,&_device_handle);
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        tries ++;
    } while ((ftStatus != FT_OK) && (tries < 3));

    if (ftStatus == FT_OK)
    {
        // D2XX Driver Version
        ftStatus = FT_GetDriverVersion(_device_handle,(LPDWORD)&version);
        if (ftStatus == FT_OK)
        {
            major_ver = (uint8_t) version >> 16;
            minor_ver = (uint8_t) version >> 8;
            build_ver = (uint8_t) version & 0xFF;
            std::cout << "D2XX Driver Version: " << major_ver << "." << minor_ver << "." << build_ver << std::endl;
        }
        else
            printf("Unable to Get D2XX Driver Version") ;

        // Latency Timer
        ftStatus = FT_GetLatencyTimer (_device_handle,(PUCHAR)&latencyTimer);
        if (ftStatus == FT_OK)
            std::cout << "Latency Timer: "<< latencyTimer << std::endl;
        else
            std::cout << "Unable to Get Latency Timer" << std::endl;

        // These are important values that can be altered to suit your needs
        // Timeout in microseconds: Too high or too low value should not be used
        FT_SetTimeouts(_device_handle,ReadTimeout,WriteTimeout);
        // Buffer size in bytes (multiple of 4096)
        FT_SetUSBParameters(_device_handle,RX_BUFFER_SIZE,TX_BUFFER_SIZE);
        // Good idea to purge the buffer on initialize
        FT_Purge (_device_handle,FT_PURGE_RX);

        // Send Get Widget Params to get Device Info
        std::cout << "Sending GET_WIDGET_PARAMS packet... " << std::endl;
         res = FTDI_SendData(GET_WIDGET_PARAMS,(unsigned char *)&size,2);
        if (res == NO_RESPONSE)
        {
            FT_Purge (_device_handle,FT_PURGE_TX);
             res = FTDI_SendData(GET_WIDGET_PARAMS,(unsigned char *)&size,2);
            if (res == NO_RESPONSE)
            {
                FTDI_ClosePort();
                return  NO_RESPONSE;
            }
        }
        else
            std::cout << " PRO Connected Succesfully" << std::endl;
        // Receive Widget Response
        std::cout << "Waiting for GET_WIDGET_PARAMS_REPLY packet... " << std::endl;
        res=FTDI_ReceiveData(GET_WIDGET_PARAMS_REPLY,(unsigned char *)&_PRO_Params,sizeof(DMXUSBPROParamsType));
        if (res == NO_RESPONSE)
        {
            res=FTDI_ReceiveData(GET_WIDGET_PARAMS_REPLY,(unsigned char *)&_PRO_Params,sizeof(DMXUSBPROParamsType));
            if (res == NO_RESPONSE)
            {
                FTDI_ClosePort();
                return  NO_RESPONSE;
            }
        }
        else
        {
            std::cout << " GET WIDGET REPLY Received ... " << std::endl;
            // Firmware  Version
            VersionMSB = _PRO_Params.FirmwareMSB;
            VersionLSB = _PRO_Params.FirmwareLSB;
            // Display All Info avialable
            res = FTDI_SendData(GET_WIDGET_SN,(unsigned char *)&size,2);
            res=FTDI_ReceiveData(GET_WIDGET_SN,(unsigned char *)&temp,4);
            std::cout << "-----------::USB PRO Connected [Information Follows]::------------" << std::endl;
            std::cout << "\t  FIRMWARE VERSION: " << VersionMSB << "." << VersionLSB << std::endl;
            BreakTime = (int) (_PRO_Params.BreakTime * 10.67) + 100;
            std::cout << "\t  BREAK TIME: " << BreakTime << " micro sec " << std::endl;
            MABTime = (int) (_PRO_Params.MaBTime * 10.67);
            std::cout << "\t  MAB TIME: " << MABTime << " micro sec" << std::endl;
            std::cout << "\t  SEND REFRESH RATE: " << _PRO_Params.RefreshRate << " packets/sec" << std::endl;
            std::cout << "----------------------------------------------------------------\n" << std::endl;
            return TRUE;
        }
    }
    else // Can't open Device
    {
        return FALSE;
    }
}


/* Function : init_promk2
 * Author    : ENTTEC
 * Purpose  : Activates the PRO MK2; Sets both Ports for DMX
 * Parameters: none
 * Notes: use the Key in your API to activate the PRO MK2
 **/
void EnttecPro::init_promk2()
{
    uint8_t PortSet[] = {1,1};
    BOOL res = 0;

    if (setApiKey())
    {
        FTDI_PurgeBuffer();
        res = FTDI_SendData(SET_API_KEY_LABEL,_APIKey,4);
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
        std::cout << "PRO Mk2 ... Activated ... " << std::endl;

        // Enable Ports to DMX on both
        res = FTDI_SendData(SET_PORT_ASSIGNMENT_LABEL,PortSet,2);
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
        std::cout << "PRO Mk2 ... Ready for DMX on both ports ... " << std::endl;
    }
    else
    {

    }


}

/* Function : enable_midi
 * Author    : ENTTEC
 * Purpose  : Enables MIDI on Port2
 * Parameters: none
 **/
void EnttecPro::enable_midi()
{
    uint8_t PortSet[] = {1,2};
    BOOL res = 0;

    FTDI_PurgeBuffer();
    // Enable Ports to DMX on port1 and MIDI on Port2
    res = FTDI_SendData(SET_PORT_ASSIGNMENT_LABEL,PortSet,2);
    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    std::cout << "PRO Mk2 ... Ready for MIDI and DMX1 ... " << std::endl;
}

/* Function : SendDMX
 * Author    : ENTTEC
 * Purpose  : Send DMX via the USB PRO
 * Parameters: PortLabel: the label tells which port to send DMX on
 * Note     : Use the keys in your API to send DMX to Port 2
 **/
void EnttecPro::SendDMX(int PortLabel)
{
    unsigned char myDmx[513];
    int counter = 100;
    BOOL res =0;
    if (_device_handle != NULL)
    {
        // Looping to Send DMX data
        std::cout << " Press Enter to Send DMX data :" << std::endl;
        //_getch();
        for (int i = 0; i < counter ; i++)
        {
            // sets the channels to increasing value: 1=1, 2=2 etc ....
            memset(myDmx,i,sizeof(myDmx));

            // First byte has to be 0
            myDmx[0] = 0;

            // send the array here
            res = FTDI_SendData(PortLabel, myDmx, 513);
            if (res < 0)
            {
                std::cout << "FAILED to send DMX ... exiting" << std::endl;
                FTDI_ClosePort();
                break;
            }
            std::cout << "DMX Data from 0 to 10: " << std::endl;
            for (int j = 0; j <= 8; j++)
                std::cout << myDmx[j] << " ";
            std::cout << std::endl << "Iteration: " << i;

        }
    }
}

/* Function : ReceiveDMX
 * Author    : ENTTEC
 * Purpose  : Recieve DMX via the USB PRO
 * Parameters: PortLabel: the label tells which port to receive DMX from
 * Note     : Use the keys in your API to receive DMX from Port 2
 **/
void EnttecPro::ReceiveDMX(int PortLabel)
{
    unsigned char myDmxIn[513];
    BOOL res =0;
    if (_device_handle != NULL)
    {
        // Looping to receiving DMX data
        std::cout << "Press Enter to receive DMX data :" << std::endl;
        //_getch();
        std::cout << "Setting the widget to receive all DMX data ... " << std::endl;
        unsigned char send_on_change_flag = 0;
        res = FTDI_SendData(RECEIVE_DMX_ON_CHANGE,&send_on_change_flag,1);
        if (res < 0)
        {
            std::cout << "DMX Receive FAILED" << std::endl;
            FTDI_ClosePort();
            return;
        }
        memset(myDmxIn,0,513);
        /* Will receive 99 dmx packets from the PRO MK2
        ** For real-time scenarios, read in a while loop in a separate thread
        **/
        for (int i = 0; i < 99 ; i++)
        {
            res = FTDI_ReceiveData(PortLabel, myDmxIn, 513);
            if (res != TRUE)
                std::cerr << "error: DMX Receive FAILED ...  " << std::endl;
            std::cout << "DMX Data from 0 to 512: " << std::endl;
            for (int j = 0; j <= 512; j++){
                printf (" %d ",myDmxIn[j]);
            }
            std::cout << "Iteration: " << i+1 << std::endl;
            std::this_thread::sleep_for(std::chrono::milliseconds(10));
        }
    }
}

/* Function : SendMIDI
 * Author    : ENTTEC
 * Purpose  : Send MIDI via the PRO MK2
 * Parameters: PortLabel: the label tells PRO MK2 to send MIDI
 *             : channel, note & velocity for the MIDI to send
 * Note     : Use the SEND MIDI Label in your API to send MIDI
 **/
void EnttecPro::SendMIDI(int PortLabel, unsigned char channel, unsigned char note, unsigned char velocity)
{
    unsigned char MyData[3];
    int counter = 10;
    BOOL res =0;
    if (_device_handle != NULL)
    {
        // Looping to Send MIDI data
        std::cout << " Press Enter to Send MIDI data :" << std::endl;
        //_getch();
        for (int i = 0; i < counter ; i++)
        {
            MyData[0] = channel;
            MyData[1] = note;
            MyData[2] = velocity;

            // send the array here
            res = FTDI_SendData(PortLabel, MyData, 3);
            if (res < 0)
            {
                std::cerr << "FAILED to send MIDI ... exiting" << std::endl;
                FTDI_ClosePort();
                break;
            }
            std::cout << "MIDI Data: " << std::endl;
            for (int j = 0; j <= 2; j++)
                std::cout << MyData[j] << " ";
            std::cout << std::endl << "Iteration: " << i;
            std::this_thread::sleep_for(std::chrono::milliseconds(500));
        }
    }
}

/* Function : ReceiveMIDI
 * Author    : ENTTEC
 * Purpose  : Receive MIDI via the USB PRO
 * Parameters: PortLabel: the label tells PRO MK2 to recieve MIDI
 * Note     : Use the Receive MIDI Label in your API to  recieve MIDI
 **/
void EnttecPro::ReceiveMIDI(int PortLabel)
{
    unsigned char MyData[3];
    int counter = 20;
    BOOL res =0;
    if (_device_handle != NULL)
    {
        // Looping to receiving MIDI data
        std::cout << "Press Enter to receive MIDI data :" << std::endl;
        //_getch();
        for (int i = 0; i < counter ; i++)
        {
            memset(MyData,0,3);
            res = FTDI_ReceiveData(PortLabel, MyData, 3);
            if (res < 0)
            {
                std::cout << "MIDI Receive FAILED ... exiting" << std::endl;
                FTDI_ClosePort();
                break;
            }
            std::cout << "MIDI Data : " << std::endl;
            for (int j = 0; j <= 2; j++){
                std::cout << MyData[j] << " " << std::endl;
            }
            std::cout << std::endl << "Iteration: " << i << std::endl;
        }
    }
}

bool EnttecPro::setApiKey()
{
    std::string key = std::getenv("MOONLIGHT_ENTTEC_APIKEY");
    //TODO: check if valid format
    if (key != "")
    {
        std::istringstream buffer{key};
        std::vector<unsigned char> bbuffer;
        unsigned int ch;

        while (buffer >> std::hex >> ch)
        {
            bbuffer.push_back(ch);
        }
        std::reverse_copy(bbuffer.begin(), bbuffer.end(), _APIKey);
        return true;
    }
    else
    {
        return false;
    }
}
