const Part = ({name, exercises}) =>{
    return(
      <p>{name} {exercises}</p>
    )
  }
  
  const Header = (props) =>{
    return (
      <h1>{props.course}</h1>  
    )
  }
  
  const Total = ({parts}) =>{
    const totalExercises = parts.reduce((result, part)=>{
      return result + part.exercises
    }, 0)
    return(
      <p>Number of exercises: {totalExercises}</p>
    )
  }
  
  const Course = ({course}) =>{  
    return(
      <>
        <Header course={course.name}/>
        {course.parts.map(part => 
          <Part key={part.id} name={part.name} exercises={part.exercises} />)}
        <Total parts={course.parts}/>
      </>
    )
  }

  export default Course