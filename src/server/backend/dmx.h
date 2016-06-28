#ifndef DMX_H
#define DMX_H

#include <array>

#include "fx.h"
#include "patch.h"
#include "pro_driver.h"

namespace Moonlight {

class DMX
{
public:
    DMX();
    ~DMX();
    void sendUniverse();

private:
    EnttecPro _driver;
    bool _readyToOutput;

    std::array<uint8_t, 512> _universe;
    std::vector<Group*> _groups;
    std::vector<Head*> _heads;
};

} // Namespace

#endif //DMX_H
