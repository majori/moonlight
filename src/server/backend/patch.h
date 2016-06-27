// This module manages patched heads

#ifndef PATCH_H
#define PATCH_H

#include <vector>
#include <array>
#include "./lib/json.hpp"

namespace Moonlight {

class Head
{
public:
    Head(std::vector<std::string> channels, unsigned short int startChannel);
    ~Head();

    void updateChannel(std::string, unsigned int, std::array<unsigned int, 512>*);

private:
    unsigned short int _id;
    std::map< std::string, unsigned int >_channels;
    unsigned short int _startChannel;
};

class Group
{
public:
    Group();
    ~Group();

    void addHead(Head*);
    void updateHeads(std::string, unsigned int, std::array<unsigned int, 512>*);

private:
    unsigned short int _id;
    std::vector<Head*> _heads;
};

} // Namespace

#endif //PATCH_H
