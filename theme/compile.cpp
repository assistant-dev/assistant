#include<bits/stdc++.h>
using namespace std;
string s;
int main (int argc, char *argv[]) {
    freopen(argv[1], "r", stdin);
    freopen(argv[2], "w", stdout);
    while (getline(cin, s)) {
        for (auto i:s) {
            // something like 00 0d 0a a2
            printf("%02x", static_cast<int>(i));
        }
    }
    return 0;
}
