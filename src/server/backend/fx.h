#ifndef FX_H
#define FX_H

#include <map>
#include <string>

typedef double (*easer)(double);

namespace Moonlight {

class FX
{
public:
    FX();
    ~FX();

private:
    std::map<std::string, easer> _easers;
};

} // Namespace

#endif //FX_H
