#include <iostream>

#include "dmx.h"

using namespace Moonlight;

int main(int argc, char**argv)
{
    DMX dmx = DMX();
    std::vector<std::string> chans = {"red", "green", "blue", "dimmer"};
    int id = dmx.patchHead(chans, 1);
    dmx.updateHead(id, "red", 255);
    dmx.updateHead(id, "blue", 60);
    dmx.updateHead(id, "dimmer", 100);
}
