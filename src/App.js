import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import TableHeader from './components/TableHead';
import ToolBarTable from './components/ToolbarTable';
import AddForm from './components/AddForm';


const DESSERTS= gql`
query{
  Desserts{
    dessert
    id
    calories
    fat
    carb
    protein
    
  }
}
`;

const RESETDATA= gql`
  mutation Reset{
    reset{
      dessert
      id
      calories
      fat
      carb
      protein
    }
  }
`;

const SAVEDATA=gql`
  mutation saveData($dessert:String!,$carb:Int!,$fat:Int!,$protein:Int!,$calories:Int!){
    addDessert(dessert:$dessert,carb:$carb,fat:$fat,protein:$protein,calories:$calories){
      dessert
      calories
      fat
      carb
      protein
    }
  }
`;

const DELETE=gql`
  mutation deleteElement($id:String!){
    delete(id:$id)
  }
`;

const descC=(a, b, orderBy)=>{
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const comparation=(order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descC(a, b, orderBy)
    : (a, b) => -descC(a, b, orderBy);
}

const stableSort=(array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0, 
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const headerConfig=[
  { id: 'dessert', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
  { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
  { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
  { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
  { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
]


const App =() => {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [localData, setLocalData] = useState();
  const [deleteMutation]=useMutation(DELETE);
  const [resetData]=useMutation(RESETDATA)
  const [addDesert]=useMutation(SAVEDATA);
 

  const [fetchData,{data,refetch}]=useLazyQuery(DESSERTS);

  useEffect(() => {
    fetchData()
  },[fetchData])
  
  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = localData.Desserts.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };


  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleDelete=()=>{
    
    selected.map((item)=>{
      deleteMutation({variables:{id:item}});
    })
    setSelected([]);
    refetch();
  }

  const handleReset=()=>{
    resetData()
    setSelected([]);
    refetch()
  }

  const handleSave=(data)=>{
    addDesert({variables:data})
    refetch()
  }

  return (
    <div className={classes.root}>
      <AddForm save={handleSave} />
      {
        localData?
        <Paper className={classes.paper}>
        <ToolBarTable numSelected={selected.length} deleteSelection={handleDelete} resetData={handleReset}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="enhanced table"
          >
            <TableHeader
              classes={classes}
              numSelected={selected.length}
              order={order}
              headerConfig={headerConfig}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={localData.Desserts.length}
            />
            <TableBody>
              {stableSort(localData.Desserts, comparation(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id )}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          key={Math.random()}
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.dessert}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carb}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        
      </Paper>:''
      }
      
      
    </div>
  );
}

export default App;