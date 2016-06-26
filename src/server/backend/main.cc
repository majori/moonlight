#include <iostream>

#include "./lib/pro_driver.h"

// our good main function with everything to do the test
int main(int argc, char**argv)
{
    EnttecPro driver = EnttecPro();
    uint8_t Num_Devices =0;
    uint16_t device_connected =0;
    uint8_t hversion;
    int i=0;
    int device_num=0;
    bool res = 0;

    // If you face problems identifying the PRO: Use this code to reload device drivers: takes a few secs
    // FTDI_Reload();

    // Just to make sure the Device is correct
    std::cout << "Press Enter to Intialize Device :" << std::endl;
    //_getch();
    Num_Devices = driver.FTDI_ListDevices();
    // Number of Found Devices
    if (Num_Devices == 0)
    {
        std::cout << "Looking for Devices  - 0 Found" << std::endl;
    }
    else
    {
        // If you want to open all; use for loop
        // we'll open the first one only
         for (i=0;i<Num_Devices;i++)
         {
            if (device_connected)
                break;
            device_num = i;
            device_connected = driver.FTDI_OpenDevice(device_num);
         }

        //SendDMX(SEND_DMX_PORT1);
        driver.ReceiveDMX(RECEIVE_DMX_PORT1);

        // Clear the buffer
        driver.FTDI_PurgeBuffer();
        // Check if device is Pro Mk2 ?
        res = driver.FTDI_SendData(HARDWARE_VERSION_LABEL,NULL,0);
        res = driver.FTDI_ReceiveData(HARDWARE_VERSION_LABEL,(unsigned char *)&hversion,1);
        if (hversion == 2)
        {
            std::cout << "PRO Mk2 found ... Sending Init Messages ..." << std::endl;
            driver.init_promk2();

            // Send and Receive DMX on PORT2
            driver.SendDMX(SEND_DMX_PORT2);
            driver.ReceiveDMX(RECEIVE_DMX_PORT2);

            // Send and Recieve MIDI
            driver.enable_midi();
            driver.SendMIDI(SEND_MIDI_PORT,10,20,0x12);
            driver.ReceiveMIDI(RECEIVE_MIDI_PORT);
        }

    }

    // Finish all done
    std::cout << "Press Enter to Exit :" << std::endl;
    //_getch();
    return 0;
}
