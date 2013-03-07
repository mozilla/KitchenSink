KitchenSink
###########

Displays a list of APIs along with some information about ability on current
device/system.

List of APIs is taken from 
https://wiki.mozilla.org/WebAPI#Planned_for_initial_release_of_B2G_.28aka_Basecamp.29 
There is an idea to use 
https://developer.mozilla.org/en-US/docs/Apps/Reference#Firefox_OS_device_APIs instead

Possible signs:

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
  This app will be installed in Marketplace when ready

``make install`` to make a zip and install in the phone for development
https://github.com/digitarald/make-fxos-install/ to read more about that.
