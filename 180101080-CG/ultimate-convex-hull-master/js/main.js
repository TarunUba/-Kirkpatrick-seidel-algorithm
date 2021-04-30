var instructions = [
    "To add vertices, click on the canvas before the next move turns orange. To add random points, press the <i>'p'</i> key.",
    "The upper and lower hulls of our points are computed separately in this algorithm. We may simply connect the upper and lower hulls to create a complete convex hull. For the time being, let's concentrate on the upper half of our points, which are created by taking a segment above the line that connects the minimum and maximum x-coordinate points. By reversing the signs of coordinates, the lower hull can be determined.",
    "Now that we're just dealing with the upper points, we can start working on the upper hull. We'll divide and conquer our points by using the median $x$ value to <b>divide</b> them into two sets.",
    "We need to find an <i>bridge</i> edge that connects one hull point from our left set to another hull point in our right set. Our convex hull will have this bridge edge, which will <b>merge</b> our divided sets.",
    "We can see that this is the bridge edge we're looking for, but how can we deterministically quantify it in $O(n)$ time? If our ideal edge has a slope of $k$, we can experiment with different $k*$ values to see if they form a bridge edge. Let's try drawing random edges between our points to see what we get for $k*$ test values ",
    "Now that we have a random pairing, let's see if the median slope of our pairings will get us to our ideal slope $k$. By drawing a line with the slope $k median$ and sweeping it vertically, we can test this. Based on this sweep, we can say if we've found $k$ ",
    "This is our median slope line, which takes $O(n)$ time to find. Let's try sweeping it now that we have our line with $k median$ to see what points we reach at the top. We've found a bridge if we link a red point to a blue point at the end of our sweep! We'll have to rework our dilemma if that doesn't happen ",
    "Something is wrong then",
    "These are the vertices we won't pay attention to. We'll have a better chance of finding our bridge if we ignore about a quarter of our points. Let's see how it goes ",
    "Something is wrong then",
    "Something is wrong then",
    "As a result, we were able to locate our bridge edge, which is the first edge in the convex hull. So, where do we look for the rest? Let's get rid of any vertices that we know won't be on the convex hull before going on ",
    "Because the convex hull is at least as large as this bounding box, we can see that none of the points in this area will be on it. So let's delete these points to speed up our quest and then recurse on our left and right sides to find more bridges ",
    "We can see that we've reduced our problem (by eliminating unnecessary points) so that we can recurse on two smaller sub-problems now that we've found our first bridge that links two divided sets. To get the convex hull of those sets, we can basically repeat the same process on our blue and red points. So, let's take a look at what happens if we recurse on one of these sub-problems.",
    "We can re-partition our subproblem and randomly pair our points in the quest for our next bridge using a fraction of the original points. So, first, divide them into two groups, this time blue and orange ",
    "Let's find a bridge edge between our blue and peach sets now that we've separated them. Let's skip ahead because we're using the same procedure as before ",
    "",
    "",
    ""

];



$(document).ready(function () {
    /********* INFO INIT ************/
    $('.info-btn').click(function () {
        if ($(this).hasClass('show')) {
            $(this).addClass('hide').removeClass('show');
            $($(this).parent().children('.sub_info')).slideUp();
            $(this).attr('src', 'img/hide.png');
        } else {
            $(this).addClass('show').removeClass('hide');
            $($(this).parent().children('.sub_info')).slideDown();
            $(this).attr('src', 'img/show.png');
        }
    });

    /********* VISUALIZATION INIT **********/
    // initialize instructions
    updateInstructions(instructions[0]);

    $('.next-button').click(function () {
        if (fxn_i < fxns.length - 1 && !$('.next-button').hasClass('disabled')) {
            updateInstructions(instructions[fxn_i + 1]);
            fxns[fxn_i].next();
            fxn_i++;
        }

        if (fxn_i == fxns.length - 1) $('.next-button').addClass('disabled');
        if (fxn_i == 1) $('.prev-button').removeClass('disabled');
    });

    $('.prev-button').click(function () {
        if (fxn_i > 0 && !$('.prev-button').hasClass('disabled')) {
            updateInstructions(instructions[fxn_i - 1]);
            fxns[fxn_i].prev();
            fxn_i--;
        }

        if (fxn_i == 0) $('.prev-button').addClass('disabled');
        if (fxn_i == fxns.length - 2) $('.next-button').removeClass('disabled');
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 39) $(".next-button").trigger("click");
        else if (e.keyCode == 37) $(".prev-button").trigger("click");
        else if (e.keyCode == 80 && fxn_i == 0) {
            for (var i = 0; i < 5; i++) {
                // generate a random point
                var p_x = Math.random() * (width - 50) + 25;
                var p_y = Math.random() * (height - 50) + 25;

                // add it to vertices
                vertices.push([p_x, p_y]);
                redrawVerticies();
            }

            // check if at least 5 edges in upper hull
            var [xs, ys] = unzip(vertices);
            var x_min = [width, 0],
                x_max = [0, 0];
            for (var i = 0; i < vertices.length; i++) {
                if (vertices[i][0] < x_min[0]) x_min = vertices[i];
                if (vertices[i][0] > x_max[0]) x_max = vertices[i];
            }

            // make test if point is above or below divider
            var sl = (x_max[1] - x_min[1]) / (x_max[0] - x_min[0]);
            var inLowerHull = function (d) {
                return d[1] <= (d[0] - x_min[0]) * sl + x_min[1]
            }

            var upperHullCount = svg.selectAll('.vertex').filter(function (d) { return inLowerHull(d); }).size();
            if (upperHullCount >= 6) $('.next-button').removeClass('disabled');
            else $('.next-button').addClass('disabled');
        }
    });
});