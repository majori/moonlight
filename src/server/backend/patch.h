// This module manages patched heads

#ifndef PATCH_H
#define PATCH_H

#include <vector>
#include <array>
#include <map>

namespace Moonlight {

class Head
{
public:
    Head(std::vector<std::string> &channels, uint16_t &startChannel, std::string &name);
    ~Head();

    int getID();
    std::string getName();
    uint16_t getStartChannel();
    std::map<std::string, uint8_t> getChannels();
    void updateChannel(std::string, uint8_t, std::array<uint8_t, 512>*);

private:
    int _id;
    std::string _name;
    static int _lastID;
    std::map<std::string, uint8_t> _channels;
    uint16_t _startChannel;
};

class Group
{
public:
    Group();
    ~Group();

    void addHead(Head*);
    void updateHeads(std::string, uint8_t, std::array<uint8_t, 512>*);

private:
    int _id;
    static int _lastID;
    std::map<int,Head*> _heads;
};

} // Namespace

#endif //PATCH_H
