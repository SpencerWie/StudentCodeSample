/*
    StudentTable
    - Structural Component to display a list of Students as a Table.
*/

window.StudentTable = React.createClass({

  render() { 
    var rows = [];
    var self = this;
    this.props.students.forEach(function(student) {
      rows.push(<Student student={student} key={student.name} refresh={self.props.refresh} />);
    });

    return (
      <table className="table">
          <thead>
              <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Grade</th>
                  <th>Edit</th>
                  <th>Remove</th>
              </tr>
          </thead>
          <tbody>{rows}</tbody>
      </table>
    );
  }
});