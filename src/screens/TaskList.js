import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import todayImage from '../../assets/imgs/today.jpg';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../commonStyles';
import Task from '../components/Task';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class TaskList extends Component {
  state = {
    showDoneTasks: true,
    visibleTasks: [],
    tasks: [{
      id: Math.random(),
      desc: 'Comprar Livro react native',
      estimateAt: new Date(),
      doneAt: new Date()
    }, {
      id: Math.random(),
      desc: 'ler Livro react native',
      estimateAt: new Date(),
      doneAt: null
    }]
  };

  toggleTask = taskId => {
    const tasks = [...this.state.tasks];
    
    tasks.forEach(task => {
      if(task.id == taskId)task.doneAt = task.doneAt ? null : new Date();
    });
    this.setState({ tasks}, this.filterTasks);
  };

  componentDidMount = () => {
    this.filterTasks();
  }

  toggleFilter = () => {
    this.setState({ showDoneTasks: !this.state.showDoneTasks}, this.filterTasks);
  }

  filterTasks = () => {
    let visibleTasks = null;

    if(this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      visibleTasks = this.state.tasks.filter(task => task.doneAt === null);
    }

    this.setState({visibleTasks});
  }

  render() {
    const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
    return (
      <View style={styles.container}>
        <ImageBackground source={todayImage} style={styles.background}>
          <View style={styles.titleBar}>
            <View style={styles.iconBar}>
              <TouchableOpacity onPress={this.toggleFilter}>
                <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} size={20} color={commonStyles.colors.secondary}/>
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <FlatList data={this.state.visibleTasks} keyExtractor={item => `${item.id}`} renderItem={({ item }) => <Task {...item} toggleTask={this.toggleTask} />} />
        </View>
        <Text>TaskList</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 3
  },
  taskList: {
    flex: 7
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  title: {
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 20
  },
  subtitle: {
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 40 : 10
  }
})