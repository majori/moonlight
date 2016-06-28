#include <iostream>

#include "fx.h"
#include "./lib/easing.h"

using namespace Moonlight;

FX::FX()
{

    // ## Map easing functions

    // Linear interpolation (no easing)
    _easers["LinearInterpolation"] = LinearInterpolation;

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
