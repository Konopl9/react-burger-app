import React, {useEffect, useState, useCallback} from 'react';
import {connect, useDispatch, useSelector } from 'react-redux';

import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from '../../store/actions/index';
import axios from "../../axios-orders";

const BurgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false);

  const dispatch = useDispatch();

  const ings = useSelector(state => {
    return state.burgerBuilder.ingredients
  });

  const price = useSelector(state => {
    return state.burgerBuilder.totalPrice
  });

  const error = useSelector(state => {
    return state.burgerBuilder.error
  });

  const isAuth = useSelector(state => {
    return state.auth.token !== null
  });

  const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
  const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName))
  const inInitIngredients = useCallback(() => dispatch(actions.initIngredients()), []);
  const onInitPurchase = () => dispatch(actions.purchaseInit())
  const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path))

  useEffect(() => {
    inInitIngredients();
  }, [inInitIngredients])

  const purchaseContinueHandler = () => {
    onInitPurchase();
    props.history.push('/checkout');

  }

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  }

  const purchaseHandler = () => {
    if (isAuth) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout')
      props.history.push('/auth')
    }

  }

  const updatePurchaseState = (ingredients) => {
    //TODO LOOK!!!
    const sum = Object.keys(ingredients)
        .map(igKey => {
          return ingredients[igKey];
        }).reduce((sum, el) => {
          return sum + el;
        }, 0);
    return sum > 0

  }
  //TODO: DEBUG TO LOOK HOW IT ACTUALLY WORKS
  const disabledInfo = {
    ...ings
  };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0
  }
  // {salad: true, meat: false...}
  let orderSummary = null;
  let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

  if (ings) {
    burger = (
        <Auxiliary>
          <Burger ingredients={ings}/>
          <BuildControls
              ingredientAdded={onIngredientAdded}
              ingredientRemoved={onIngredientRemoved}
              disabled={disabledInfo}
              purchasable={updatePurchaseState(ings)}
              ordered={purchaseHandler}
              price={price}
              isAuth={isAuth}
          />
        </Auxiliary>
    );
    orderSummary = <OrderSummary
        price={price}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinue={purchaseContinueHandler}
        ingredients={ings}/>
  }

  return (
      <Auxiliary>
        <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Auxiliary>
  );
}
export default withErrorHandler(BurgerBuilder, axios);