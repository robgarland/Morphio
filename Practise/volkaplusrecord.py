# OpenVokaWavMean-win64.py
# public-domain sample code by Vokaturi, 2020-02-20
#
# A sample script that uses the VokaturiPlus library to extract the emotions from
# a wav file on disk. The file has to contain a mono recording.
#
# Call syntax:
#   python3 OpenVokaWavMean-win64.py path_to_sound_file.wav
#
# For the sound file hello.wav that comes with OpenVokaturi, the result should be:
#	Neutral: 0.760
#	Happy: 0.000
#	Sad: 0.238
#	Angry: 0.001
#	Fear: 0.000

import sys
import sounddevice as sd
import scipy.io.wavfile
import time
import matplotlib.pyplot as plt

sys.path.append("../Practise/OpenVokaturi-3-4/api")
import Vokaturi

print ("Loading library...")
Vokaturi.load("../Practise/OpenVokaturi-3-4/lib/open/win/OpenVokaturi-3-4-win64.dll")
print ("Analyzed by: %s" % Vokaturi.versionAndLicense())

fs = 44100  # Sample rate
seconds = 10  # Duration of recording
file_name = "output.wav"
emotions = []

for i in range(2):
    samples = sd.rec(int(seconds * fs), samplerate=fs, channels=2, dtype="int16")
    sd.wait()  # Wait until recording is finished
    #scipy.io.wavfile.write(file_name, fs, myrecording)  # Save as WAV file
    
    #print ("Reading sound file...")
    #(sample_rate, samples) = scipy.io.wavfile.read(file_name)
    #print(samples)
    #print ("   sample rate %.3f Hz" % sample_rate)
    
    print ("Allocating Vokaturi sample array...")
    buffer_length = len(samples)
    #print(samples)
    
    print ("   %d samples, %d channels" % (buffer_length, samples.ndim))
    c_buffer = Vokaturi.SampleArrayC(buffer_length)
    if samples.ndim == 1:  # mono
    	c_buffer[:] = samples[:] / 32768.0
    else:  # stereo
    	c_buffer[:] = 0.5*(samples[:,0]+0.0+samples[:,1]) / 32768.0
    
    print ("Creating VokaturiVoice...")
    voice = Vokaturi.Voice (fs, buffer_length)
    
    print ("Filling VokaturiVoice with samples...")
    voice.fill(buffer_length, c_buffer)
    
    print ("Extracting emotions from VokaturiVoice...")
    quality = Vokaturi.Quality()
    emotionProbabilities = Vokaturi.EmotionProbabilities()
    voice.extract(quality, emotionProbabilities)
    
    if quality.valid:
        probs = [emotionProbabilities.neutrality,emotionProbabilities.happiness,emotionProbabilities.sadness,emotionProbabilities.anger,emotionProbabilities.fear]
        emotions.append(probs)
        print ("Neutral: %.3f" % emotionProbabilities.neutrality)
        print ("Happy: %.3f" % emotionProbabilities.happiness)
        print ("Sad: %.3f" % emotionProbabilities.sadness)
        print ("Angry: %.3f" % emotionProbabilities.anger)
        print ("Fear: %.3f" % emotionProbabilities.fear)
    else:
        probs = [0,0,0,0,0]
        emotions.append(probs)
        print ("Not enough sonorancy to determine emotions")
       
    voice.destroy()

intervals = range(len(emotions))

t = [seconds*i for i in intervals]
s1 = [emotions[i][0] for i in intervals]
s2 = [emotions[i][1] for i in intervals]
s3 = [emotions[i][2] for i in intervals]
s4 = [emotions[i][3] for i in intervals]
s5 = [emotions[i][4] for i in intervals]

plt.plot(t, s1, label = "Neutrality")
plt.plot(t, s2, label = "Happiness")
plt.plot(t, s3, label = "Sadness")
plt.plot(t, s4, label = "Anger")
plt.plot(t, s5, label = "Fear")

plt.xlabel('time (s)')
plt.ylabel('Probability')
plt.legend()
plt.title('Tone Summary')

plt.show()