import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Animated, { Layout, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createTask, deleteTask, observableTasks, updateTask } from './database/repositories';
import './global.css';

type Task = {
  id: string;
  task: string;
  isCompleted: boolean;
}

export default function App() {
  const obs = observableTasks();

  const [inputTask, setInputTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const subscription = obs.subscribe((taskList) => {

      const incompleteTasks = taskList.filter((t) => !t.isCompleted);
      const completeTasks = taskList.filter((t) => t.isCompleted);
      setTasks([...incompleteTasks, ...completeTasks]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [obs]);

  const handleAddTask = async () => {
    if (inputTask === "") {
      return;
    }
    await createTask(inputTask);
    setInputTask("");
  };

  const handleCompleteTask = async (task: Task) => {
    await updateTask(task.id, !task.isCompleted);


    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((t) =>
        t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
      );
      const incompleteTasks = updatedTasks.filter((t) => !t.isCompleted);
      const completeTasks = updatedTasks.filter((t) => t.isCompleted);
      return [...incompleteTasks, ...completeTasks];
    });
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FB7185" }}>
        <View className="flex-row p-4 justify-center">
          <Text className="text-2xl font-bold text-white">Task Manager</Text>
        </View>

        <View className='flex-1 p-4 gap-4'>
          <TextInput
            className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg w-full shadow-lg p-4"
            placeholder="New Task"
            value={inputTask}
            onChangeText={setInputTask}
            onSubmitEditing={handleAddTask}
          />

          <View>
            <Text className="mb-2 text-lg font-semibold text-white">Tasks</Text>
          </View>
          <FlatList
            data={tasks}
            renderItem={({ item, index }) => (
              <Animated.View
                key={item.id}
                className="flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow-lg mb-4"
                entering={SlideInLeft.delay(index * 100)}
                exiting={SlideOutRight.duration(500)}
                layout={Layout.springify()}
              >
                <View className="flex flex-row items-center">
                  <BouncyCheckbox
                    size={25}
                    fillColor="#FB7185"
                    iconStyle={{ borderColor: "#FB7185" }}
                    onPress={() => handleCompleteTask(item)}
                    isChecked={item.isCompleted}
                  />
                  <Text className={`text-lg ${item.isCompleted ? 'line-through text-zinc-500' : 'text-zinc-700'}`}>
                    {item.task}
                  </Text>
                </View>
                <View className="flex flex-row items-center">
                  <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                    <Text className="text-red-500">Delete</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
