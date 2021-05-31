# -*- coding: utf-8 -*-
"""
Created on Fri May 28 14:17:50 2021

@author: garla
"""
import numpy as np
def rvalue(x):
    if x > 150:
        r = (-255/60)*x + 892.5
    elif x < -150:
        r = (-255/60)*x - 637.5
    elif -30 < x < 30:
        r = (255/60)*x + 127.5
    elif 30 <= x <= 150:
        r = 255
    else:
        r = 0     
    return r

def gvalue(x):
    if 30 < x < 90:
        g = (-255/60)*x + 382.5
    elif -150 < x < -90:
        g = (255/60)*x + 637.5
    elif -90 <= x <= 30:
        g = 255
    else:
        g = 0     
    return g

def bvalue(x):
    if x >= 150 or x <= -90:
        b = 255
    elif -90 < x < -30:
        b = (-255/60)*x - 127.5
    elif 90 < x < 150:
        b = (255/60)*x - 382.5
    else:
        b = 0     
    return b

def colored(r, g, b, text):
    return "\033[38;2;{};{};{}m{} \033[38;2;255;255;255m".format(r, g, b, text)   

low = -1
high = 1
aa = np.array([np.random.rand() for i in range(10)])
va = np.array([np.random.rand() for i in range(10)])
naa = np.array([-np.random.rand() for i in range(10)])
nva = np.array([-np.random.rand() for i in range(10)])

caa = np.concatenate((aa,naa))
cva = np.concatenate((va,nva))
np.random.shuffle(caa)
np.random.shuffle(cva)

for i in range(len(caa)):
    arousal = caa[i]
    valence = cva[i]
    
    hyp = np.sqrt(arousal**2 + valence**2)
    
    if valence >= 0 and arousal >= 0:
        x = (np.arcsin(arousal/hyp))*(180/np.pi)
    elif valence >= 0 and arousal <= 0:
        x = (np.arcsin(arousal/hyp))*(180/np.pi)
    elif valence < 0 and arousal < 0:
        ang = (np.arcsin(arousal/hyp))*(180/np.pi)
        x = -180 - ang
    else:
        ang = (np.arcsin(arousal/hyp))*(180/np.pi)
        x = 180 - ang
    print("----------")
    print(arousal,valence)
    print(x, hyp)
    
    
    
    r = rvalue(x)
    g = gvalue(x)
    b = bvalue(x)
    print(r,g,b)
