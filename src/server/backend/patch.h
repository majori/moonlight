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
    Head(std::vector<std::string> &channels, uint16_t &startChannel, std::string &name, int &fromHeadID);
    ~Head();

    int getID();
    std::string getName();
    uint16_t getStartChannel();
    std::map<std::string, uint8_t> getChannels();
    int getFromHeadID();
    void updateChannel(std::string, uint8_t, std::array<uint8_t, 512>*);

private:
    static int _lastID;

    int _id;
    std::string _name;
    std::map<std::string, uint8_t> _channels;
    uint16_t _startChannel;
    int _fromHeadID;
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
