#include <iostream>

#include "dmx.h"

using namespace Moonlight;

int main(int argc, char**argv)
{
    DMX dmx = DMX();
    dmx.sendUniverse();
}
