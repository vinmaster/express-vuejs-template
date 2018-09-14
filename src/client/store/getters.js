export default {
  isLoading: state => state.isLoading,
  alerts: state => state.alerts,
  isAuth: state => !!state.token,
  username: state => state.username,
  title: state => state.title,
  subtext: state => state.subtext,
};
