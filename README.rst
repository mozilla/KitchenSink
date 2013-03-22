KitchenSink
===========

*List of APIs is taken from 
https://wiki.mozilla.org/WebAPI#Planned_for_initial_release_of_B2G_.28aka_Basecamp.29 
There is an idea to use 
https://developer.mozilla.org/en-US/docs/Apps/Reference#Firefox_OS_device_APIs instead*

Look and feel
#############

App displays a list of APIs along with some information about ability on current
device/system.

Two types of tests are used:

**Preparation test** checks if DOM of the device is prepared and containes 
the variables needed for API to work. This doesn't mean API will work (see 
SMS in desktop Firefox).

**Actual tests** asynchronous functions which are actually calling the API 
and testing if it is working.

Some APIs need no UI and these are clickable. Vibration API for example.

Possible informations:

* ``[C]`` - available for certified apps only

* ``+`` - DOM is prepared (parameter does exist in ``window`` or ``navigator``)

* ``-`` - DOM isn't prepared

* ``*`` - test successful

* ``F`` - test failed

* ``?`` - no idea how/if to implement the preparation test

Green background indicates that the list item will react on click.


INSTALL
#######
`
*This app will be installed in Marketplace when ready*

1. Clone repository

2. Modify paths to ``adb`` and ``xpcshell`` in Makefile

3. Switch on the  *Remote Debugging* on the phone

4. Run ``make install`` to make a zip and install in the phone for development
   https://github.com/digitarald/make-fxos-install/ to read more about that.

TODO:
#####

* Show information about API (Accordion UI?)

* Provide simple examples how to use an API
