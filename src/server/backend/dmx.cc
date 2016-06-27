#include <iostream>

#include "dmx.h"
#include "patch.h"
#include "pro_driver.h"

using namespace Moonlight;

DMX::DMX()
{
    _driver = EnttecPro();
    _universe.fill(0);
    _readyToOutput = _driver.Init();
}

DMX::~DMX()
{

}

bool DMX::initDriver()
{

}

void DMX::sendUniverse()
{
    _driver.SendDMX(SEND_DMX_PORT1, &_universe);
}
