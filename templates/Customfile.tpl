config.vm.provider "virtualbox" do |v|
  v.customize [
    'modifyvm', :id,
    "--cpuexecutioncap", {{cpuexecutioncap}},
    "--memory", {{ram}},
    "--cpus", {{cpus}}
  ]
end
