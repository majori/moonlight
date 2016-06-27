#ifndef DMX_H
#define DMX_H

#include <array>

#include "patch.h"
#include "pro_driver.h"

namespace Moonlight {

class DMX
{
public:
    DMX();
    ~DMX();
    bool initDriver();
    void sendUniverse();

private:
    EnttecPro _driver;
    std::array<uint16_t, 512> _universe;
    bool _readyToOutput;

};

} // Namespace

#endif //DMX_H
