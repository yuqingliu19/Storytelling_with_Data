halfCirclesBasic <- function(x, y, r, col="#00000050", ...) {
  xlim <- range(x)
  ylim <- range(y)
  plot(0, 0, type="n", asp=1, xlab="", ylab="", xlim=xlim, ylim=ylim, xaxt="n", yaxt="n", bty="n", ...)
  
  vals <- cbind(x, y, r)
  tmp <- apply(vals, 1, function(v) {
    halfCircle(v[1], v[2], v[3], col=col, border=NA)
  })   
}
