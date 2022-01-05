def readfile()
  file = File.open('input.txt').each_line do |line|
    yield line
  end
ensure
  file.close if file
end

module RangeLimit
  def limit(min, max)
    return self if min.nil? || max.nil?

    new_begin = [self.begin, min].max
    new_end = [self.end, max].min
    Range.new(new_begin, new_end)
  end
end

class Range
  include RangeLimit
end

def process
  cubes = {}
  readfile do |line|
    puts line
    power, line = line.split(' ')
    xr,yr,zr = line.split(',').map { |x| eval x[/[\d\.\-]+/]  }
    for x in xr.limit(-50, 50)
      for y in yr.limit(-50, 50)
        for z in zr.limit(-50, 50)
          cubes[x.to_s + "/" + y.to_s + "/" + z.to_s] = power.to_sym
        end
      end
    end
  end
  cubes.select { |k,v| v == :on }.count
end




puts process