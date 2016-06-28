#include <iostream>

#include "patch.h"

using namespace Moonlight;
using json = nlohmann::json;

// ## HEAD CLASS
//

Head::Head(std::vector<std::string> channels, unsigned short int startChannel)
{
    if (startChannel > 512)
    {
        std::cerr << "Invalid start channel for head, " << startChannel << std::endl;
        return;
    }

}

Head::~Head()
{

}

void Head::updateChannel(std::string channelName, unsigned int value, std::array<unsigned int, 512>* universe)
{
    unsigned int index = _channels.at(channelName);
    universe->at(_startChannel + index) = value;
}

// ## GROUP CLASS
//

Group::Group()
{

}

Group::~Group()
{

}

void Group::addHead(Head* newHead)
{

}

void Group::updateHeads(std::string channelName, unsigned int value, std::array<unsigned int, 512>* universe)
{
    for(size_t i{0}; i<_heads.size();i++)
    {
        _heads[i]->updateChannel(channelName, value, universe);
    }
}
