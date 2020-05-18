import React, {useState, useEffect} from 'react';
import {ScrollView, Text, FlatList, ActivityIndicator} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {Appbar, TextInput, Button} from 'react-native-paper';
import Todo from './Todo';

function Todos() {
  const [todo, setTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  const ref = firestore().collection('todos');
  console.log(ref);

  async function addTodo() {
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo('');
  }

  useEffect(() => {
    return ref.onSnapshot((arr) => {
      const list = [];
      arr.forEach((doc) => {
        const {title, complete} = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });

      setTodos(list);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <>
      <Appbar>
        <Appbar.Content title={'Todo List'} />
      </Appbar>
      <FlatList
        style={{flex: 1}}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Todo {...item} />}
      />
      <TextInput value={todo} label={'New Todo'} onChangeText={setTodo} />
      <Button onPress={() => addTodo()}>Add Todo</Button>
    </>
  );
}

export default Todos;
