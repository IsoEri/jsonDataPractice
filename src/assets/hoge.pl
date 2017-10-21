print "create start data.txt"

$datafile='./data.txt';

open(FH,">$datafile");
print FH "$in{'name'}";
close(FH);

print "create end data.txt"
