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
    if (_readyToOutput) _driver.SendDMX(&_universe);
}

int DMX::patchHead(std::vector<std::string> channels, uint16_t startChannel) {
    Head* newHead = new Head(channels, startChannel);
    int id = newHead->getID();
    if (id != 0) {
        _heads.insert(std::pair<int,Head*>(id, newHead));
    }
    return id;
}

void DMX::updateHead(int id, std::string channelName, uint8_t value)
{
    std::map<int, Head*>::iterator it{_heads.find(id)};
    if (it == _heads.end())
    {
        std::cerr << "DMX: head with id " << id << " not found!" << std::endl;
        return;
    }
    it->second->updateChannel(channelName, value, &_universe);
    sendUniverse();
}
