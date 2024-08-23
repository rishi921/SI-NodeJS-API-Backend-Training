const getErrorStatus = (req, res) => {
    return res.status(404).send("404 . Resources not found for the given url")
}
export { getErrorStatus };