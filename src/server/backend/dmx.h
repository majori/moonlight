#ifndef DMX_H
#define DMX_H

#include <array>

#include "patch.h"
#include "pro_driver.h"
#include "fx.h"

namespace Moonlight {

class DMX
{
public:
    DMX();
    ~DMX();
    void sendUniverse();
    int  patchHead(std::vector<std::string>, uint16_t);
    void updateHead(int, std::string, uint8_t);
    bool outputStatus();

private:
    FX        _fx;
    EnttecPro _driver;
    bool      _readyToOutput;

    std::array<uint8_t, 512> _universe;
    std::map<int,Group*>     _groups;
    std::map<int,Head*>      _heads;
};

} // Namespace

#endif //DMX_H
