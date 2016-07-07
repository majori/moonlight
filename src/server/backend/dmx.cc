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
    // Delete heads
    for(std::map<int,Head*>::iterator it=_heads.begin(); it!=_heads.end(); ++it)
    {
        delete it->second;
    }

    // Delete groups
    for(std::map<int,Group*>::iterator it=_groups.begin(); it!=_groups.end(); ++it)
    {
        delete it->second;
    }
}

void DMX::sendUniverse()
{
    if (_readyToOutput) _driver.SendDMX(&_universe);
}

int DMX::patchHead(std::vector<std::string> channels, uint16_t startChannel, std::string name, int fromHeadID) {
    if (startChannel == 0) return 0;
    Head* newHead = new Head(channels, startChannel, name, fromHeadID);
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

bool DMX::outputStatus()
{
    return _readyToOutput;
}

std::map<int,Head*> DMX::getHeads()
{
    return _heads;
}

std::string DMX::getDriverErrMsg()
{
    return _driver.getErrMsg();
}

std::array<uint8_t, 512> DMX::getUniverse()
{
    return _universe;
}
