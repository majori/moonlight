#include <iostream>
#include <thread>
#include <chrono>

#include "dmx.h"

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

void DMX::sendUniverse()
{
    if (_readyToOutput) _driver.SendDMX(&_universe);
}

void DMX::patchHead(std::vector<std::string> channels, unsigned short int startChannel) {
    _heads.push(new Head(channels, startChannel));
}
