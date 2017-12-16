/*
    App
    - General app to load/update in Students.
    - Contains a CreateView to allow automatic server updates, to avoid trigging page refreshes.
*/
window.App = React.createClass({

  // Load Students From Database REST - GET  
  loadStudents() {
    var self = this;
    $.ajax({
        url: "/api/students",
        type: 'GET'       
      }).then(function(data) {
        self.setState({ students: data });
      });
  },
  
  componentDidMount() {
    this.loadStudents();
  },  

  getInitialState() {
    return { students: [], attributes: [] };
  },
  
  render() {

    return (
        <div>
            <StudentTable refresh={this.loadStudents} students={this.state.students} />   
            <CreateStudentView refresh={this.loadStudents} />
        </div>
    );
  }
});

// Root Render
ReactDOM.render(<App />, document.getElementById('main') );