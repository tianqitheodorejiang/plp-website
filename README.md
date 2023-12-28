pilam.mit.edu
=============

to update the website, run `./update-scripts <KERBEROS>`
   and then enter your mit account password
   (since it is connecting to an mit athena server)

TROUBLESHOOTING:

How to manually update the website:
- Connect to the Athena dialup service using SecureCRT
- type `ssh plp@scripts "cd m && git fetch origin master && git reset --hard FETCH_HEAD && git clean -df"`

https://groups.mit.edu/webmoira/list/plp-www <= add future webmasters to this mailing list


TODO
----

Add socials
