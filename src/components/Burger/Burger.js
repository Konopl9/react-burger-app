import React from 'react'

import classes from './Burger.module.css'
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";


const burger = (props) => {
  //TODO: DEBUG TO LOOK HOW IT ACTUALLY WORKS

  // Convert ingredients too array for map iteration
  let transformedIngredients = Object.keys(props.ingredients).map(igKey => {
    //...Array is array of keys [meat, cheese....]
    return [...Array(props.ingredients[igKey])].map((_, i) => {
      // We skipped separate values and use on index
      return <BurgerIngredient key={igKey + i} type={igKey}/>
    });
  })
      .reduce((arr, el) => {
        return arr.concat(el)
      }, []);

  if(transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients!</p>
  }

  return (
      <div className={classes.Burger}>
        <BurgerIngredient type="bread-top"/>
        {transformedIngredients}
        <BurgerIngredient type="bread-bottom"/>
      </div>
  );
};

export default burger;

