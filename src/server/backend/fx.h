#ifndef FX_H
#define FX_H

#include <map>
#include <string>
#include <functional>

namespace Moonlight {

class FX
{
public:
    FX();
    ~FX();
    uint8_t ease(std::string &f, uint8_t &b, uint8_t &e, uint16_t &d, uint16_t &t);

private:
    std::map<std::string, std::function<double(double)>> _easers;
};

} // Namespace

#endif //FX_H
