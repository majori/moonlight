#include <iostream>
#include <thread>
#include <chrono>

#include "dmx.h"
#include "fx.h"


using namespace Moonlight;

DMX::DMX()
{
    _driver = EnttecPro();
    _universe.fill(0);
    _readyToOutput = _driver.Init();
    _fx = FX();
}

DMX::~DMX()
{

}

void DMX::sendUniverse()
{
    std::string easer1 = "CubicInOut";
    std::string easer2 = "QuinticOut";
    uint8_t b = 0;
    uint8_t e = 255;
    uint16_t d = 100;
    _universe[3] = 255;

    for (uint16_t i{0}; i <= 50000; i++)
    {
        _universe[0] = _fx.ease(easer1,b,e,d,i);
        _universe[1] = _fx.ease(easer2,b,e,d,i);
        if (_readyToOutput) _driver.SendDMX(&_universe);
    }
}

void DMX::patchHead(std::vector<std::string> channels, uint16_t startChannel) {
    _heads.push_back(new Head(channels, startChannel));
}
