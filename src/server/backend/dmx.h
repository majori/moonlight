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
    void patchHead(std::vector<std::string>, uint16_t);
private:
    EnttecPro _driver;
    bool _readyToOutput;

    std::array<uint8_t, 512> _universe;
    std::vector<Group*> _groups;
    std::vector<Head*> _heads;
    FX _fx;
};

} // Namespace

#endif //DMX_H
