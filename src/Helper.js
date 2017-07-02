import moment from "moment";

exports.getSelectedContent = (data, n) => {
    let count = n || data.length;
    return _.chain(data)
        .sortBy((o) => {
            return moment(o.updatedAt).unix();
        })
        .reverse()
        .take(count)
        .value();
}