require 'set'

def readfile()
  file = File.open('input.txt').each_line do |line|
    yield line
  end
ensure
  file.close if file
end

def process
  percent = 0
  xs = Set.new
  ys = Set.new
  zs = Set.new
  ranges = []
  readfile do |line|
    puts line
    power, line = line.split(' ')
    xr,yr,zr = line.split(',').map { |x| x.scan(/[\d\-]+/).map(&:to_i)  }
    xs << xr[0]
    xs << xr[1] + 1
    ys << yr[0]
    ys << yr[1] + 1
    zs << zr[0]
    zs << zr[1] + 1
    rng = Hash.new
    rng[:x1] = xr[0]
    rng[:x2] = xr[1]
    rng[:y1] = yr[0]
    rng[:y2] = yr[1]
    rng[:z1] = zr[0]
    rng[:z2] = zr[1]
    rng[:power] = power.to_sym
    ranges.push(rng)
  end
  x = xs.to_a.sort
  y = ys.to_a.sort
  z = zs.to_a.sort
  count = 0
  ranges.reverse!
  x.each_index { |ix| 
    next if ix == x.length - 1
    xranges = ranges.select { |rng| x[ix] >= rng[:x1] && x[ix+1] <= rng[:x2] + 1}
    y.each_index { |iy| 
      next if iy == y.length - 1
      yranges = xranges.select { |rng| y[iy] >= rng[:y1] && y[iy+1] <= rng[:y2] +1}
      z.each_index { |iz|
        next if iz == z.length - 1
        yranges.each { |rng| 
          if z[iz] >= rng[:z1] && z[iz+1] <= rng[:z2]+1
            count += (x[ix+1] -x[ix]) * (y[iy+1] - y[iy]) * (z[iz+1] -z[iz]) if rng[:power] == :on
            break;
          end
        }
      }
    }
  }
  count
end

puts process