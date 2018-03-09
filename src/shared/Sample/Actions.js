import * as ActionTypes from './ActionTypes'
export const getSampleData = () => async (dispatch, getState) => {
  try {
    const data = await fetch('http://localhost:3000/api/sample').then(data => data.json())
    dispatch({
      type: ActionTypes.SET_SAMPLE_DATA,
      payload: data
    })
  } catch (error) {
    throw error
  }
}
