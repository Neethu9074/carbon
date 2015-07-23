# Leaked Disc Space

The difference between the total capacity of a disc/volume and the space occupied
by files is available for new files an thus considered to be free. However most
operating systems allow files to continue to exist after they have been deleted
if they are still accessed by applications.
Those files do not show up when calculating disc usage (e.g. with `du` on Linux),
but also do not show when looking at free disc space (e.g. with `df` on Linux).

The disc space occupied by these files is called _leaked_. On Linux you can find the files leaking disc space by calling `lsof | grep deleted`.

Leaked disc space is usually not a problem, especially log files that have been rotated can cause this. However if leaked disc space continues to increase, this indicates a problem, usually originated by application code not closing file handles.
