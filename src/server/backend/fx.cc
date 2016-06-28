#include <iostream>

#include <cmath>

#include "fx.h"
#include "./lib/easing.h"

using namespace Moonlight;

FX::FX()
{
    // ## Map easing functions

    // Linear interpolation (no easing)
    _easers["Linear"] = LinearInterpolation;

    // Quadratic easing; p^2
    _easers["QuadraticIn"] = QuadraticEaseIn;
    _easers["QuadraticOut"] = QuadraticEaseOut;
    _easers["QuadraticInOut"] = QuadraticEaseInOut;

    // Cubic easing; p^3
    _easers["CubicIn"] = QuadraticEaseInOut;
    _easers["CubicOut"] = CubicEaseOut;
    _easers["CubicInOut"] = CubicEaseInOut;

    // Quartic easing; p^4
    _easers["QuarticIn"] = CubicEaseInOut;
    _easers["QuarticOut"] = QuarticEaseOut;
    _easers["QuarticInOut"] = QuarticEaseInOut;

    // Quintic easing; p^5
    _easers["QuinticIn"] = QuinticEaseIn;
    _easers["QuinticOut"] = QuinticEaseOut;
    _easers["QuinticInOut"] = QuinticEaseInOut;

    // Sine wave easing; sin(p * PI/2)
    _easers["SineIn"] = SineEaseIn;
    _easers["SineOut"] = SineEaseOut;
    _easers["SineInOut"] = SineEaseInOut;

    // Circular easing; sqrt(1 - p^2)
    _easers["CircularIn"] = CircularEaseIn;
    _easers["CircularOut"] = CircularEaseOut;
    _easers["CircularInOut"] = CircularEaseInOut;

    // Exponential easing, base 2
    _easers["ExponentialIn"] = ExponentialEaseIn;
    _easers["ExponentialOut"] = ExponentialEaseOut;
    _easers["ExponentialInOut"] = ExponentialEaseInOut;

    // Exponentially-damped sine wave easing
    _easers["ElasticIn"] = ElasticEaseIn;
    _easers["ElasticOut"] = ElasticEaseOut;
    _easers["ElasticInOut"] = ElasticEaseInOut;

    // Overshooting cubic easing;
    _easers["BackIn"] = BackEaseIn;
    _easers["BackOut"] = BackEaseOut;
    _easers["BackInOut"] = BackEaseInOut;

    // Exponentially-decaying bounce easing
    _easers["BounceIn"] = BounceEaseIn;
    _easers["BounceOut"] = BounceEaseOut;
    _easers["BounceInOut"] = BounceEaseInOut;
}

FX::~FX()
{

}

// f: easing style name, b: beginning value, e: end value, d: duration, t: current time
uint8_t FX::ease(std::string &f, uint8_t &b, uint8_t &e, uint16_t &d, uint16_t &t)
{
    if (d == 0 || t >= d) return e;
    double x = t/(double)d;
    double y = _easers[f](x);
    return std::max(0.0, std::min(std::round((e-b)*y+b), 255.0));
}
