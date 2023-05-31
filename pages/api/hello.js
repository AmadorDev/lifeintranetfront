// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import useAuth from "../../hooks/useAuth";

// const { auth } = useAuth();

export default (req, res) => {
  res.login = true;
  res.statusCode = 200;
  res.json({ name: "John Doe" });
};
