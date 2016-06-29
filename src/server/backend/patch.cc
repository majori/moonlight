#include <iostream>

#include "patch.h"

using namespace Moonlight;

// ## HEAD CLASS
//
int Head::_lastID = 0;
int Group::_lastID = 0;

Head::Head(std::vector<std::string> &channels, unsigned short int &startChannel)
{
    if (startChannel > 512)
    {
        std::cerr << "Patch: Invalid start channel " << startChannel << std::endl;
        _id = 0;
        return;
    }
    for (uint8_t i{0};i<channels.size();i++)
    {
        if (_channels.find(channels[i]) != _channels.end())
        {
            std::cerr << "Patch: Channel list have same name twice!" << std::endl;
            _id = 0;
            return;
        }
        _channels.insert(std::pair<std::string, uint8_t>(channels[i], i));
    }
    Head::_lastID++;
    _id = _lastID;

    // Because arrays start indexing from 0 and DMX from 1, substract 1
    _startChannel = startChannel-1;

}

Head::~Head() {}

int Head::getID()
{
    return _id;
}

void Head::updateChannel(std::string channelName, uint8_t value, std::array<uint8_t, 512>* universe)
{
    unsigned int index = _channels.at(channelName);
    universe->at(_startChannel + index) = value;
}

// ## GROUP CLASS
//

Group::Group()
{
    Group::_lastID++;
    _id = Group::_lastID;
}

Group::~Group()
{
    for(std::map<int,Head*>::iterator it=_heads.begin(); it!=_heads.end(); ++it)
    {
        delete it->second;
    }
}

void Group::addHead(Head* newHead)
{
    _heads.insert(std::pair<int,Head*>(newHead->getID(), newHead));
}

void Group::updateHeads(std::string channelName, uint8_t value, std::array<uint8_t, 512>* universe)
{
    for(std::map<int,Head*>::iterator it=_heads.begin(); it!=_heads.end(); ++it)
    {
        it->second->updateChannel(channelName, value, universe);
    }
}
