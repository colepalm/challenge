/*
 * Serve JSON to our AngularJS client
 */

var feeData = [
    {
        "order_item_type": "Real Property Recording",
        "fees": [
            {
                "name": "Recording (first page)",
                "amount": "26.00",
                "type": "flat"
            },
            {
                "name": "Recording (additional pages)",
                "amount": "1.00",
                "type": "per-page"
            }
        ],
        "distributions": [
            {
                "name": "Recording Fee",
                "amount": "5.00"
            },
            {
                "name": "Records Management and Preservation Fee",
                "amount": "10.00"
            },
            {
                "name": "Records Archive Fee",
                "amount": "10.00"
            },
            {
                "name": "Courthouse Security",
                "amount": "1.00"
            }
        ]
    },
    {
        "order_item_type": "Birth Certificate",
        "fees": [
            {
                "name": "Birth Certificate Fees",
                "amount": "23.00",
                "type": "flat"
            }
        ],
        "distributions": [
            {
                "name": "County Clerk Fee",
                "amount": "20.00"
            },
            {
                "name": "Vital Statistics Fee",
                "amount": "1.00"
            },
            {
                "name": "Vital Statistics Preservation Fee",
                "amount": "1.00"
            }
        ]
    }
];

exports.name = function (req, res) {
    res.json({
        name: 'Bob'
    });
};

exports.prices = function (req, res) {
    var response = [];

    req.body.forEach(function (order) {

        var length = response.length - 1;
        var total = 0;
        var orderItems = [];

        order.order_items.forEach(function(orderItem) {

            feeData.forEach(function(feeData) {

                if (feeData.order_item_type === orderItem.type) {
                    orderItems.push(processPayment(feeData.fees, orderItem));
                    total += orderItems[orderItems.length - 1].amount;
                }
            })
        });

        response.push({
            total: total,
            id: order.order_number,
            date: order.order_date,
            orderItems: orderItems
        });
    });

    res.json(response);
};

function processPayment(feeData, orderItem) {
    var per, total = 0;
    var pages = orderItem.pages - 1;

    feeData.forEach(function(fee) {
        fee.type === 'flat' ? total += parseFloat(fee.amount) : per = parseFloat(fee.amount);
    });

    if (pages > 0) {
        total += pages * per;
    }

    return {
        id: orderItem.order_item_id,
        type: orderItem.type,
        amount: total
    };
}

exports.dists = function (req, res) {
    var response = [];
    var compare = 0;

    req.body.forEach(function (order) {

        var total = 0;
        var distNumsBirth = [];
        var distNumsProp = [];
        var otherFund = 0;
        var distributions = [];
        compare = 0;

        order.order_items.forEach(function (orderItem) {

            feeData.forEach(function (fee) {

                if (fee.order_item_type === orderItem.type && orderItem.type === 'Birth Certificate') {
                    distNumsBirth = addDistributions(distNumsBirth, fee.distributions);
                    total += processPayment(fee.fees, orderItem).amount;
                }

                if (fee.order_item_type === orderItem.type && orderItem.type === 'Real Property Recording') {
                    distNumsProp = addDistributions(distNumsProp, fee.distributions);
                    total += processPayment(fee.fees, orderItem).amount;
                }
            })
        });

        if (total !== compare) {
            otherFund = total - compare;
        }

        var toAdd = {
            type: distributions.order_item_type,
            date: order.order_date,
            orderNumber: order.order_number,
            distributions: []
        };

        distNumsProp.forEach(function (num, index) {
            toAdd.distributions.push({
                name: feeData[0].distributions[index].name,
                amount: num
            })
        });

        distNumsBirth.forEach(function (num, index) {
            toAdd.distributions.push({
                name: feeData[1].distributions[index].name,
                amount: num
            })
        });

        toAdd.distributions.push({
            name: 'Other',
            amount: otherFund
        });

        response.push(toAdd);

    });

    function addDistributions(distNums, distributions) {

        distributions.forEach(function(distribution, index) {
            if (distNums[index] === undefined)
                distNums[index] = 0;
            distNums[index] += parseFloat(distribution.amount);
            compare += parseFloat(distribution.amount)

        });
        return distNums;
    }

    res.json(response);
};
