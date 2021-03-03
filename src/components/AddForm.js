import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AddForm({save}) {
  const [open, setOpen] = React.useState(false);
  const [dessertError, setDessertError] = useState(true);
  const [caloriesError, setCaloriesError] = useState(true);
  const [fatError, setFatError] = useState(true);
  const [carbsError, setCarbsError] = useState(true);
  const [proteinError, setProteinError] = useState(true);
  const [active, setActive] = useState(true)
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    if(!dessertError && !caloriesError && !fatError && !carbsError && !proteinError){
        setActive(false)
    }else{
        setActive(true)
    }
  },[dessertError,caloriesError,fatError,carbsError,proteinError])

  const changeErrorState=(error,value)=>{
    switch(error){
        case 'dessert':{
            setDessertError(value)
            break
        }
        case 'calories':{
            setCaloriesError(value)
            break
        }
        case 'fat':{
            setFatError(value)
            break
        }
        case 'carbs':{
            setCarbsError(value)
            break
        }
        case 'protein':{
            setProteinError(value)
            break
        }
        default:{}
             
        }
    }
  

  const validate=(ev, type,error)=>{

    if(type==='number'){
        if(ev.target.value.length > 0 && ev.target.value.search(/[a-zA-Z]/g) === -1){
            changeErrorState(error,false)
        }else{
            changeErrorState(error, true)
        }
      }else{
        if(ev.target.value.length > 0 && ev.target.value.search(/[0-9]/g) === -1){
            changeErrorState(error, false)
        }else{
            changeErrorState(error, true)
        } 
      }
  }
  
  const saveData=()=>{
      const form = document.getElementById("form");
      const dessert = form.dessert.value;
      const calories = form.calories.value;
      const fat = form.fat.value;
      const carbs = form.carbs.value;
      const protein = form.protein.value;
    
      save({
          dessert,
          calories:Number(calories),
          fat:Number(fat),
          carb:Number(carbs),
          protein:Number(protein)
        });

        setOpen(false);
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Dessert
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Dessert</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Please fill the form to add a new Dessert
          </DialogContentText>
          <form id="form">
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Dessert Name"
            type="text"
            name="dessert"
            fullWidth
            onChange={(ev)=>validate(ev,'text', 'dessert')}
            error={dessertError}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Calories"
            type="text"
            name="calories"
            fullWidth
            onChange={(ev)=>validate(ev,'number','calories')}
            error={caloriesError}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Fat"
            name="fat"
            type="text"
            fullWidth
            onChange={(ev)=>validate(ev,'number','fat')}
            error={fatError}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Carbs"
            type="text"
            name="carbs"
            fullWidth
            onChange={(ev)=>validate(ev,'number','carbs')}
            error={carbsError}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Protein"
            type="text"
            name="protein"
            fullWidth
            error={proteinError}
            onChange={(ev)=>validate(ev,'number','protein')}
          />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button disabled={active} onClick={saveData} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}