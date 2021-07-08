/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const isArrowUp = checkCode.bind(null, 38, 'ArrowUp');
export const isArrowDown = checkCode.bind(null, 40, 'ArrowDown');
export const isArrowLeft = checkCode.bind(null, 37, 'ArrowLeft');
export const isArrowRight = checkCode.bind(null, 39, 'ArrowRight');
export const isReturn = checkCode.bind(null, 13, 'Enter');
export const isSpace = checkCode.bind(null, 32, 'Space');
export const isTab = checkCode.bind(null, 9, 'Tab');
export const isBackspace = checkCode.bind(null, 8, 'Backspace');
export const isDelete = checkCode.bind(null, 46, 'Delete');
export const isEscape = checkCode.bind(null, 27, 'Escape');
export const isA = checkCode.bind(null, 65, 'KeyA');
export const isC = checkCode.bind(null, 67, 'KeyC');
export const isD = checkCode.bind(null, 68, 'KeyD');
export const isE = checkCode.bind(null, 69, 'KeyE');
export const isF = checkCode.bind(null, 70, 'KeyF');
export const isN = checkCode.bind(null, 78, 'KeyN');
export const isV = checkCode.bind(null, 86, 'KeyV');
export const isW = checkCode.bind(null, 87, 'KeyW');
export const isS = checkCode.bind(null, 83, 'KeyS');
export const isP = checkCode.bind(null, 80, 'KeyP');
export const isL = checkCode.bind(null, 76, 'KeyL');
export const isQuestionMarkOrMinus = checkCode.bind(null, 191, 'Minus');
export const isHome = checkCode.bind(null, 36, 'Home');
export const isEnd = checkCode.bind(null, 35, 'End');

export const isCtrl = e => !!e.ctrlKey;
export const isMeta = e => !!e.metaKey;
export const isAlt = e => !!e.altKey;
export const isModifierPressed = e => !!(e.ctrlKey || e.shiftKey || e.altKey || e.metaKey);
export const isLeftClick = e => e.button === 0;

function checkCode(numericalCode, stringCode, event) {
  return event.keyCode === numericalCode || event.code === stringCode;
}

/*
Key                 Code
backspace           8
tab                 9
enter               13
shift               16
ctrl                17
alt                 18
pause/break         19
caps lock           20
escape              27
(space)             32
page up             33
page down           34
end                 35
home                36
left arrow          37
up arrow            38
right arrow         39
down arrow          40
insert              45
delete              46
0                   48
1                   49
2                   50
3                   51
4                   52
5                   53
6                   54
7                   55
8                   56
9                   57
a                   65
b                   66
c                   67
d                   68
e                   69
f                   70
g                   71
h                   72
i                   73
j                   74
k                   75
l                   76
m                   77
n                   78
o                   79
p                   80
q                   81
r                   82
s                   83
t                   84
u                   85
v                   86
w                   87
x                   88
y                   89
z                   90
left window key     91
right window key    92
select key          93
numpad 0            96
numpad 1            97
numpad 2            98
numpad 3            99
numpad 4            100
numpad 5            101
numpad 6            102
numpad 7            103
numpad 8            104
numpad 9            105
multiply            106
add                 107
subtract            109
decimal point       110
divide              111
f1                  112
f2                  113
f3                  114
f4                  115
f5                  116
f6                  117
f7                  118
f8                  119
f9                  120
f10                 121
f11                 122
f12                 123
num lock            144
scroll lock         145
semi-colon          186
equal sign          187
comma               188
dash                189
period              190
forward slash       191
grave accent        192
open bracket        219
back slash          220
close braket        221
single quote        222
*/
