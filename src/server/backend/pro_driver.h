#ifndef _PRO_DRIVER_H
#define _PRO_DRIVER_H

#include <stdint.h>
#include "./lib/ftd2xx.h"

/********************** PLEASE SET THESE FIRST **********************************/

/******************** PRO MK2 LABELS: ASSIGN AS PER YOUR API (request the pdf if you don't have one) *********************/
#define SET_PORT_ASSIGNMENT_LABEL       0
#define SEND_DMX_PORT2                  0
#define RECEIVE_DMX_PORT2               0
#define SEND_MIDI_PORT                  0
#define RECEIVE_MIDI_PORT               0

/***********************************************************************************/

// Enttec Pro definitions
#define GET_WIDGET_PARAMS       3
#define GET_WIDGET_PARAMS_REPLY 3
#define SET_WIDGET_PARAMS       4
#define RECEIVE_DMX_PORT1       5
#define SEND_DMX_PORT1          6
#define SEND_DMX_RDM_TX         7
#define RECEIVE_DMX_ON_CHANGE   8
#define RECEIVED_DMX_COS_TYPE   9
#define GET_WIDGET_SN           10
#define SET_API_KEY_LABEL               13
#define HARDWARE_VERSION_LABEL          14


#define ONE_BYTE    1
#define DMX_START_CODE 0x7E
#define DMX_END_CODE 0xE7
#define OFFSET 0xFF
#define DMX_HEADER_LENGTH 4
#define BYTE_LENGTH 8
#define HEADER_RDM_LABEL 5
#define NO_RESPONSE 0
#define DMX_PACKET_SIZE 512

#define RX_BUFFER_SIZE 40960
#define TX_BUFFER_SIZE 40960

#pragma pack(1)
typedef struct {
        unsigned char FirmwareLSB;
        unsigned char FirmwareMSB;
        unsigned char BreakTime;
        unsigned char MaBTime;
        unsigned char RefreshRate;
}DMXUSBPROParamsType;

typedef struct {
        unsigned char UserSizeLSB;
        unsigned char UserSizeMSB;
        unsigned char BreakTime;
        unsigned char MaBTime;
        unsigned char RefreshRate;
}DMXUSBPROSetParamsType;
#pragma pack()

struct ReceivedDmxCosStruct
{
    unsigned char start_changed_byte_number;
    unsigned char changed_byte_array[5];
    unsigned char changed_byte_data[40];
};

#define MAX_PROS 20
#define SEND_NOW 0
#define TRUE 1
#define FALSE 0
#define HEAD 0
#define IO_ERROR 9


class EnttecPro {
public:
    EnttecPro();
    bool Init();
    void ReceiveMIDI(int PortLabel);
    bool SendMIDI(int PortLabel, unsigned char channel, unsigned char note, unsigned char velocity);
    void ReceiveDMX(int PortLabel);
    bool SendDMX(int PortLabel, std::array<uint16_t, 512>*);
    bool setApiKey();

private:
    int      FTDI_SendData(int label, unsigned char *data, unsigned int length);
    int      FTDI_ReceiveData(int label, unsigned char *data, unsigned int expected_length);
    uint8_t  FTDI_SendDataToPro(uint8_t label, unsigned char *data, uint32_t length);
    void*    Get_Pro_Handle();
    uint8_t  FTDI_ReceiveDataFromPro(uint8_t label, unsigned char *data, uint32_t expected_length);
    uint16_t FTDI_OpenDevice(int device_num);
    int      FTDI_ListDevices();
    void     FTDI_ClosePort();
    void     FTDI_PurgeBuffer();
    void     FTDI_Reload();
    void     enable_midi();

    unsigned char _APIKey[4] = {0x00, 0x00, 0x00, 0x00};
    FT_HANDLE _device_handle;
    DMXUSBPROParamsType _PRO_Params;

};

#endif
