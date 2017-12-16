/*
    Student
    - Record Displayed on Student Table. Can be deleted and updated.
*/
window.Student = React.createClass({

  getInitialState: function() {
    return {display: true };
  },
  
  // Deletes the element from the Database by calling REST - DELETE
  handleDelete() {
    var self = this;
    if(window.confirm("Are you sure you want to delete this student?")) {
        $.ajax({
            // DELETE --> /api/students/{id}
            url: '/api/students/' + self.props.student.id, //self.props.student._links.self.href,
            type: 'DELETE',
            success: function(result) {
              self.props.refresh();
            },
            error: function(xhr, ajaxOptions, thrownError) {
              toastr.error(xhr.responseJSON.message);
            }
        });
    }
  },
  
  // Triggers a state change to change to an Edit View
  updateView() {
    this.setState({update: true});        
  },
  
  // If the user cancels an update change input validations back to default and refresh.
  cancelUpdate() {
    this.state.update = false; 
    
    var group_NameNode = ReactDOM.findDOMNode(this.refs.newNameGroup);
    var group_GradeNode = ReactDOM.findDOMNode(this.refs.newGradeGroup);
    var group_AgeNode = ReactDOM.findDOMNode(this.refs.newAgeGroup);
    
    if(group_NameNode != null) group_NameNode.className = "form-group";
    if(group_GradeNode != null) group_GradeNode.className = "form-group";
    if(group_AgeNode != null) group_AgeNode.className = "form-group";
    
    this.forceUpdate();
  },
  
  // Modifies the element in the Database by calling REST - PUT
  handleUpdate() {
  
    // Get fields from form and validate
    var curStudent = {};
    
    var nameNode = ReactDOM.findDOMNode(this.refs.newName);
    var ageNode = ReactDOM.findDOMNode(this.refs.newAge);
    var gradeNode = ReactDOM.findDOMNode(this.refs.newGrade);
    
    var group_NameNode = ReactDOM.findDOMNode(this.refs.newNameGroup);
    var group_AgeNode = ReactDOM.findDOMNode(this.refs.newAgeGroup);
    var group_GradeNode = ReactDOM.findDOMNode(this.refs.newGradeGroup);
    
    curStudent.name = nameNode.value.trim();
    curStudent.age = ageNode.value.trim();
    curStudent.grade = gradeNode.value.trim();     
    curStudent.id = this.props.student.id;
    
    group_NameNode.className = "form-group";
    group_AgeNode.className = "form-group";
    group_GradeNode.className = "form-group";
    
    if(nameNode.value.trim() == ""){ 
        group_NameNode.className = "form-group has-error";
        return false;
    }
    if(ageNode.value.trim() == "") { 
        group_AgeNode.className = "form-group has-error";
        return false;
    }     
    
    // Call out to Server for update
    var self = this;
    $.ajax({
        // PUT --> /api/students/{id} (note: PUT is used because this should be idempotent)
        url: '/api/students/' + self.props.student.id, //self.props.student._links.self.href, 
        type: 'PUT',        
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(curStudent),
        success: function(result) {
            self.props.student.name = result.name;
            self.props.student.age = result.age;
            self.props.student.grade = result.grade;
            self.props.student.id = result.id;
            self.setState({update: false});
        },
        error: function(xhr, ajaxOptions, thrownError) {
          toastr.error(xhr.responseJSON.message);
        }
    });    
  },
  
  // Renders the record for View or Update depending on the state
  render() {
    var self = this;
    var viewRecordStudent = (
           <tr>
              <td>{this.props.student.name}</td>
              <td>{this.props.student.age}</td>
              <td>{this.props.student.grade}</td>
              <td>
                <button className="btn btn-primary" onClick={this.updateView}>
                    <span className="glyphicon glyphicon-pencil"></span>
                </button>
              </td>      
              <td>
                <button className="btn btn-danger" onClick={this.handleDelete}>
                    <span className="glyphicon glyphicon-remove"></span>
                </button>
              </td> 
            </tr>         
    );
    if (this.state.update == true)
    {
       // Generate grade drop-down list, adds selected attribute to the value of the current grade 
       var gradeList = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"]; 
       var gradeHTML = [];
        
       gradeList.forEach(function(grade){
         var option = (<option>{grade}</option>);
         if(grade == self.props.student.grade)
            option = (<option selected>{grade}</option>);
         gradeHTML.push(option);
       });
        
       viewRecordStudent = (
           <tr className="form-horizontal">
              <td ref="newNameGroup" className="form-group">
                <input ref="newName" type="text" defaultValue={this.props.student.name} className="form-control" />
              </td>
              <td ref="newAgeGroup" class="form-group">
                <input ref="newAge" type="number" min="0" defaultValue={this.props.student.age} className="form-control" />
              </td>
              <td ref="newGradeGroup" class="form-group">
                <select ref="newGrade" type="number" className="form-control">
                    {gradeHTML}
                </select>
              </td>              
              <td>
                <button className="btn btn-success" onClick={this.handleUpdate}>
                    <span className="glyphicon glyphicon-ok-circle" title="Confirm Edit" ></span>
                </button>  
              </td>      
              <td>
                <button className="btn btn-warning" onClick={this.cancelUpdate}>
                    <span className="glyphicon glyphicon-remove-circle" title="Cancel Edit"></span>
                </button>                  
              </td>
            </tr>            
        );       
    }
    
    return viewRecordStudent;
  }
});