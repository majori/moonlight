CC=g++
DEPENDENCIES := -lpthread -ldl -lrt

CFLAGS= $(DEPENDENCIES) -Wall -Wextra -std=c++11
APP = moonlight

all: $(APP)

$(APP): main.cc pro_driver.o
	$(CC) main.cc pro_driver.o ./lib/libftd2xx.a -o $(APP) $(CFLAGS)

pro_driver.o: ./lib/pro_driver.cc
	$(CC) ./lib/pro_driver.cc -c -o pro_driver.o $(CFLAGS)

clean:
	rm -f *.o ; rm $(APP)
